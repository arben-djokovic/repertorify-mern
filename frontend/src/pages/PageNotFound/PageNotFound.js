import React from 'react'
import { Helmet } from "react-helmet-async";

export default function PageNotFound() {
  return (
    <div>
      <Helmet>
        <title>Page Not Found | Repertorify</title>
        <meta
          name="description"
          content="The page you are looking for was not found on Repertorify."
        />
      </Helmet>
        <img src="/assets/404.png" alt="" />
    </div>
  )
}
