import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownList = ({completed}) => (
  
    <Dropdown
      text="See the task you have finished"
      id="ddl"
      style={{height: "100%"}}
      fluid
      selection
      options={completed}
    />
  )
  
  export default DropdownList;