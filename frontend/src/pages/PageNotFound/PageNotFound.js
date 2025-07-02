import React from 'react'
import { Helmet } from "react-helmet-async";

export default function PageNotFound() {
  return (
    <div>
      <Helmet>
        <title>Stranica nije pronađena | Repertorify</title>
        <meta
          name="description"
          content="Stranica koju tražite nije pronađena na Repertorify."
        />
        <meta property="og:title" content="Stranica nije pronađena | Repertorify" />
        <meta
          property="og:description"
          content="Stranica koju tražite nije pronađena na Repertorify."
        />
        <meta property="og:url" content="https://repertorify.com/404" />
      </Helmet>
        <img src="/assets/404.png" alt="" />
    </div>
  )
}
