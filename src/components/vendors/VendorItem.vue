<template>
	<li class="border-b-2">
		<!-- Company Name -->
		<div>{{ vendor.company }}</div>
		<!-- City, State -->
		<div>{{ vendor.city }}</div>
		<!-- Phone - Link Email -->
		<div>
			<a :href="`tel:${vendor.phone}`">{{ vendor.phone }}</a> -
			<a :href="`mailto:${vendor.email}`">{{ vendor.email }}</a>
		</div>
	</li>
</template>

<script>
	export default {
		props: ["vendor"],
	};
</script>
