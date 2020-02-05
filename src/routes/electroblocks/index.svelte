<script>
		import VerticalComponentContainer from '../../components/electroblocks/VerticalComponentContainer.svelte';
		import Simulator from '../../components/electroblocks/home/Simulator.svelte';
		import Step from '../../components/electroblocks/home/Steps.svelte';

</script>

<style>
	.slot-wrapper {
		height: 100%;
		width: 100%;
	}
</style>

<VerticalComponentContainer >
	<div class="slot-wrapper" slot="top">
		<Simulator />
	</div>
	<div class="slot-wrapper" slot="bottom">
			<Step />
	</div>
</VerticalComponentContainer>
