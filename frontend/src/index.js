import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App.js'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'))
;<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Around The U.S.</title>
  <meta
    name="description"
    content="Interactive page where users can add, remove, or like photos."
  />
  <meta
    name="keywords"
    content="web development, JS web development, website development project, web development education"
  />
  <meta name="author" content="Omri Ben Tal at Practicum" />
  <link rel="favicon" href="./favicon.ico" />
</head>
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>,
)
