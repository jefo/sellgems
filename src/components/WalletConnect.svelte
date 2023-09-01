<script lang="ts">
    import {getContext} from "svelte";
    import * as QRCode from 'qrcode';
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton';
    import type {Wallet} from "$lib/tonconnect";

    export let show = false;

    const wallet = getContext<Wallet>('wallet');
    const modalStore = getModalStore();
    const link = wallet.connect();
    const modal: ModalSettings = {
        type: 'component',
        title: 'Connect Wallet',
        image: 'https://i.imgur.com/WOgTG96.gif',
    };
    const cBase = 'card p-4 w-modal shadow-xl space-y-4';
    const cHeader = 'text-2xl font-bold';
    QRCode.toDataURL(link).then((url: string) => {
        modal.image = url;
    });

    $: {
        if (show) {
            modalStore.trigger(modal);
        } else {
            modalStore.close();
        }
    }
</script>

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>{$modalStore[0].title}</header>
        <img src={$modalStore[0].image} alt="QR"/>
    </div>
{/if}