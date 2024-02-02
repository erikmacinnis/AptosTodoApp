import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const CustomLoader = () => (
  <div className='loader'>
    <Segment>
      <Dimmer active>
        <Loader size='massive'>Loading</Loader>
      </Dimmer>

      <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
    </Segment>
  </div>
)

export default CustomLoader