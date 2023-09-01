<script lang="ts">
    import '../app.postcss';
    import {AppShell, AppBar, initializeStores} from '@skeletonlabs/skeleton';

    // Highlight JS
    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';
    import {storeHighlightJs} from '@skeletonlabs/skeleton';

    storeHighlightJs.set(hljs);

    // Floating UI for Popups
    import {computePosition, autoUpdate, flip, shift, offset, arrow} from '@floating-ui/dom';
    import {storePopup} from '@skeletonlabs/skeleton';
    import {Wallet} from "$lib/tonconnect";
    import {setContext} from "svelte";

    storePopup.set({computePosition, autoUpdate, flip, shift, offset, arrow});

    initializeStores();

    const wallet = new Wallet();
    wallet.init().then((data) => {
        console.log('restored', data);
    }).catch(e => {
        console.error(e);
    });
    setContext('wallet', wallet);
</script>

<!-- App Shell -->
<AppShell>
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar>
            <svelte:fragment slot="lead">
                <strong class="text-xl uppercase">Create TON Gems Sale</strong>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <!-- Page Route Content -->
    <slot/>
</AppShell>
