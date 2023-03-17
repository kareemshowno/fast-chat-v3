import React from 'react'
import './FormInput.scss'
const FormInput = ({type,name,id,value,required,...otherProps}) => {
  return (
    <input required={required ? true:false} style={otherProps.style}  value={value} type={type} className='form-c' name={name} id={id} onChange={otherProps.handleChange} />
  )
}

export default FormInput