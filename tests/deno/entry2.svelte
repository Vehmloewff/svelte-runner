<script>
	import foo from 'foo'
	import bar from 'bar'
	import { dateToString } from "https://deno.land/x/date_format_deno/mod.ts"
</script>

<style>
	li.date {
		color: green
	}
</style>

<h1>Hello there!</h1>

<ul>
	<li>{foo()}</li>
	<li>{bar()}</li>
	<li class="date">{dateToString('hh:mm:ss')}</li>
</ul>
