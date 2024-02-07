import React, { useEffect, useState } from "react";
import { Grid, Image } from 'semantic-ui-react';


const NftsCollection = ({nfts}) => {

    const [nftsFormatted, setNftsFormatted] = useState([]);

    useEffect( () => {
        createFormattedTaskList();
    }, [nfts])
    
    const nftColumn = (nft) => {
        return <Grid.Column textAlign='center'>
            <Image src={nft.uriData.image} alt="Nft heck mark image" />
            <div>
                <p>{nft.uriData.description}</p>
            </div>
        </Grid.Column>
    }

    // Creates the list of rows for the grid
    const createFormattedTaskList = () => {

        const length = nfts.length;
        if (length != 0) {
            // This is represents the nfts of the leftover incompleted row
            const mod = (length) % 3;
            const nftRows = [];
            let i;
            for (i = 3; i < length; i += 3){
                let nftRow = (
                    <Grid.Row key={i / 3}>
                        {nftColumn(nfts[i-2])}
                        {nftColumn(nfts[i-1])}
                        {nftColumn(nfts[i])}
                    </Grid.Row>
                    )       
                nftRows.push(nftRow);
            }
            if (mod !== 0){
                if (mod === 1){
                    let nftRow = (
                        <Grid.Row key={i / 3}>
                            {nftColumn(nfts[length - 1])}
                        </Grid.Row>
                    )
                    nftRows.push(nftRow);
                }
                else {
                    let nftRow = (
                        <Grid.Row key={i / 3}>
                            {nftColumn(nfts[length - 2])}
                            {nftColumn(nfts[length - 1])}
                        </Grid.Row>
                    )
                    nftRows.push(nftRow);
                }
            }
            setNftsFormatted(nftRows);
        }
    }

    return (
        <div className="ddl" style={{margin: '100px'}}>
            <h1 
            style={{textAlign: "center", color: "#181818"}}>
                {`You Have ${nfts.length} from the ${window.env.COLLECTION_NAME} collection`}
            </h1>
            <br/>
            <Grid style={{margin: '20px'}} columns={3} divided>
                {nftsFormatted}
            </Grid>
        </div>
    );
}

export default NftsCollection;