<script setup>
  const props = defineProps(['count','increment']);
  let message = "This output is generated from a Vue component!";
</script>
<template>
    <div style="color: green;font-weight:bold;">{{ message }} Count: {{props.count}}</div>
    <div>Even a component in a different framework can share methods through props!</div>
    <button :onClick=props.increment>Increment Counter</button>
</template>
