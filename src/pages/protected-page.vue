<template>
  <PageLayout>
    <div class="content-layout">
      <h1 id="page-title" class="content__title">Protected Page</h1>
      <div class="content__body">
        <p id="page-description">
          <span>This page retrieves a <strong>protected message</strong> from an
            external API.</span>
          <span><strong>Only authenticated users can access this page.</strong></span>
        </p>
        <CodeSnippet title="Protected Message" :code="message" />
      </div>
    </div>
  </PageLayout>
</template>

<script setup>
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

import CodeSnippet from "@/components/code-snippet.vue";
import PageLayout from "@/components/page-layout.vue";

const message = ref("");

const getMessage = async () => {
  const { getAccessTokenSilently } = useAuth0();
  const accessToken = await getAccessTokenSilently();

  console.log("# frontend, accessToken:", accessToken, "2#")
  console.log("# env:", import.meta.env, "2#")

  const data = await fetch("/api/ml-samgeo/", {
    method: "POST",
    body: JSON.stringify({
      "bbox": [1, 2, 3, 4.9],
      "points": [[5, 666]]
    }),
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-type": "application/json"
    }
  })
  console.log("data:", data, "#")
  let output;
  if (data.statusCode === 200) {
    output = await data.json()
  } else {
    output = await data.text()
  }
  console.log("output:", output, "#")
  if (output) {
    message.value = JSON.stringify(output, null, 2);
  }

};

getMessage();
</script>
