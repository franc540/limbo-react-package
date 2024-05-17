#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectName = args[0] ? args[0].toLowerCase() : 'limbo-react-default';

const classname = projectName.split("-").map((x)=>( x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())).join("");

const directories = [
  'src',
  `src/components/${projectName}`
];

let templates={};
templates.indexjs= `import React from 'react';
  import ReactDOM from 'react-dom';
  import ${classname} from './components/${projectName}/${projectName}';

  if(typeof jQuery !== 'undefined'){
    jQuery.fn.react_render_${projectName.replaceAll('-','_')} = function (params) {

      return this.each(function () {
        ReactDOM.render(
          <${classname} {...params}/>,
          this
          );
      });
    };  
  }else{
    ReactDOM.render(
      <${classname} {...params}/>,
      document.getElementById(area_target)
    );
  }
  `;

templates.component=`import React, { useState, useEffect } from "react";
export default function ${classname}(props) {
  return (
    <><h1>Hello ${classname}</h1></>
  )
}`;

templates.webpack=`const path = require('path');
  const HTMLWebpackPlugin = require("html-webpack-plugin");

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'ba-${projectName}.js',
      path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: [{
                  loader: 'style-loader',
                  
                },{
                  loader: 'css-loader',
                  options: {
                      sourceMap: true
                  }
                },
                {
                  loader: 'postcss-loader',
                  options: {
                      sourceMap: true
                  }
                }
            
          ]
        }
      ],
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: "index.html",
        template: "./index.html",
      }),
    ],
    devServer: {
      static: './dist',
      hot: true
    },
  };`;

templates.indexhtml=`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Webpack basics</title>
      <script>
          var params={};
          var area_target = 'area-render-${projectName}';
      </script>
  </head>
  <body>
      <div class="container">
          <div id="area-render-${projectName}">
          </div>
      </div>
  </body>
  </html>`;

templates.package=`{
      "name": "${projectName}",
      "version": "1.0.0",
      "description": "${projectName}",
      "main": "index.js",
      "scripts": {
          "start": "webpack-dev-server --mode development --open",
          "build": "webpack --mode production"
      },
      "dependencies": {
          "react": "^17.0.2",
          "react-dom": "^17.0.2",
          "axios": "^1.4.0"
      },
      "devDependencies": {
          "@babel/core": "^7.22.10",
          "@babel/preset-env": "^7.22.10",
          "@babel/preset-react": "^7.22.5",
          "babel-loader": "^8.3.0",
          "css-loader": "^6.10.0",
          "postcss-loader": "^8.1.1",
          "style-loader": "^3.3.4",
          "html-webpack-plugin": "^4.2.0",
          "webpack": "^5.88.2",
          "webpack-cli": "^4.10.0",
          "webpack-dev-server": "^4.3.1"
      }
  }`;

let files = {
  'src/index.js':templates.indexjs,
  'webpack.config.js': templates.webpack,
  'index.html': templates.indexhtml,
  'package.json': templates.package
};
files[`src/components/${projectName}/${projectName}.js`] = templates.component;

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  }
});

Object.keys(files).forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, files[file]);
    console.log(`File created: ${file}`);
  }
});

console.log('Project structure created successfully.');