# AptosTodoApp

First step would be to create an aptos wallet.
- I've had a good experience with Petra

You will have to then create fill out the .env you can use the sample.env if you like

In the Move.toml replace the address 

Then you will want instal aptos
- I used brew to install this

In the aptos folder run aptos init
- Make sure to select testnet and use the private key you created with your Petra wallet

Run 'aptos move publish --named-addresses todo=default' in the aptos folder
- This compiles and publishes the smart contract

No you can run the application with 'npm start'
