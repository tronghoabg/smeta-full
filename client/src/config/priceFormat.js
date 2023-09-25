const priceFormat  = (number)=>{
   return (number ? number : 0).toLocaleString("en-US")
    .replace(".", ".")
}

export default priceFormat