<script lang="ts">
    import WalletConnect from "../components/WalletConnect.svelte";
    import {getContext, onDestroy} from "svelte";
    import type {Wallet, WalletInfo} from "$lib/tonconnect.js";

    let showConnect = false;

    const wallet = getContext<Wallet>('wallet');
    let address = '';
    const unsub = wallet.info.subscribe((info: WalletInfo) => {
        address = info.address;
    });

    onDestroy(() => {
        wallet.disconect();
        unsub();
    });


</script>

<div class="container mx-auto p-8 space-y-8">
    {#if address}
        Connected:&nbsp;{address}
    {:else}
        <button type="button" class="btn variant-filled-primary" on:click={() => { showConnect = true }}>Connect Wallet</button>
    {/if}
    <WalletConnect show={showConnect}/>
</div>
