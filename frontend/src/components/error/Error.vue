<template>
	<div class="error-background" @click="resolve">
		<div class="error" @click.stop>
			<div class="error-heading">
				<h2>Error</h2>
				<h2 @click.stop="resolve">&#10005;</h2>
			</div>
			<p class="error-text">{{ error }}</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: ["error", "resolve"],
};
</script>

<style scoped>
.error-background {
	backdrop-filter: blur(10px);
	background: #24242450;

	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}

.error {
	background: #24242490;
	width: 500px;
	border-radius: 2px;
}

.error h2 {
	margin: 0;
	cursor: default;
}

.error .error-heading {
	border-bottom: 1px solid #444;
	padding: 1rem;
	display: flex;
	justify-content: space-between;
}

.error .error-text {
	width: calc(80% + 40px);
	margin: 1rem auto;
}
</style>
