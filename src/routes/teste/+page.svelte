<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { user } = data;
	let userInfo: [] = [];
	onMount(async function () {
		const response = await fetch('http://localhost:8000/api/v1/user', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: user.authCookie
			}
		});
		userInfo = await response.json();
	});
</script>

<svelte:head>
	<title>Guarded page</title>
</svelte:head>

<section>
	<div>
		{#each userInfo as user}
			<div>
				<table>
					<tr>
						<th>Id</th>
						<th>Email</th>
						<th>Ativo</th>
						<th>Super user</th>
						<th>Nome</th>
					</tr>
					<tr>
						<td>{user.id}</td>
						<td>{user.email}</td>
						<td>{user.is_active}</td>
						<td>{user.is_superuser}</td>
						<td>{user.full_name}</td>
					</tr>
				</table>
			</div>
		{/each}
	</div>

	<form method="POST" action="?/logout">
		<button type="submit" name="logout" value="true">Logout</button>
	</form>
</section>
