<script>
  	import VerticalComponentContainer from '../../components/electroblocks/VerticalComponentContainer.svelte';
	import Debug from '../../components/electroblocks/arduino/Debug.svelte';
	import Message from '../../components/electroblocks/arduino/Message.svelte';
	
</script>

<style>
	.slot-wrapper {
		height: 100%;
		width: 100%}
</style>

<VerticalComponentContainer >
	<div class="slot-wrapper" slot="top">
		<Message />
	</div>
	<div class="slot-wrapper" slot="bottom">
			<Debug />
	</div>
</VerticalComponentContainer>
