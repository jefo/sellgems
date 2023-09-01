import TonConnect, {UserRejectsError} from '@tonconnect/sdk';
import {get, writable} from "svelte/store";

export interface WalletConnectInfo {
    universalLink: string,
    bridgeUrl: string,
}

export interface WalletInfo {
    address: string;
}

export class Wallet {
    private connector = new TonConnect({
        manifestUrl: 'https://sellgems.loca.lt/tonconnect-manifest.json',
    });
    private unsubscribe?: () => void;
    public info = writable<WalletInfo>({
        address: '',
    });

    init() {
        console.log('restored', localStorage.address);
        this.subscribe();
        const restore = this.connector.restoreConnection();
        return restore;
    }

    subscribe() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        this.unsubscribe = this.connector.onStatusChange(
            walletInfo => {
                if (walletInfo) {
                    console.log('walletINfo', walletInfo.account.address);
                    this.info.set({address: walletInfo.account.address});
                    localStorage.address = walletInfo.account.address;
                }
                // update state/reactive variables to show updates in the ui
            }
        );
    }

    connect() {
        const walletConnectionSource = {
            universalLink: 'https://app.tonkeeper.com/ton-connect',
            bridgeUrl: 'https://bridge.tonapi.io/bridge'
        }
        return this.connector.connect(walletConnectionSource);
    }

    async sendTx() {
        if (!this.connector.connected) {
            alert('Please connect wallet to send the transaction!');
        }
        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            messages: [
                {
                    address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
                    amount: "20000000",
                    // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
                },
                {
                    address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
                    amount: "60000000",
                    // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
                }
            ]
        }

        try {
            const result = await this.connector.sendTransaction(transaction);

            // you can use signed boc to find the transaction
            // const someTxData = await myAppExplorerService.getTransaction(result.boc);
            alert('Transaction was sent successfully');
        } catch (e) {
            if (e instanceof UserRejectsError) {
                alert('You rejected the transaction. Please confirm it to send to the blockchain');
            } else {
                alert('Unknown error happened');
                console.error(e);
            }
        }
    }

    async disconect() {
        if (this.connector.connected) {
            await this.connector.disconnect();
        }
    }
}
