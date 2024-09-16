import React from 'react'
import { Blocks } from 'react-loader-spinner'

const CenteredLoader = () => {
  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
    <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
        />
  </div>
  )
}

export default CenteredLoader