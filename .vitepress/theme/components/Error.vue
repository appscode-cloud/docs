<script setup lang="ts">
defineProps<{ is404?: boolean }>()
</script>

<template>
  <section class="fzf-wrapper fzf-bg">
    <div class="container">
      <div class="columns is-vcentered">
        <div class="column is-5">
          <div class="fzf-left-content-wrapper">
            <div class="fzf-content-inner">
              <h1 data-aos="fade-up">
                {{ is404 ? '404' : '500' }}
              </h1>
              <h2 data-aos="fade-up" data-aos-duration="800">
                {{
                  is404
                    ? "Something Is Missing!"
                    : "Something Went Wrong!"
                }}
              </h2>
              <p data-aos="fade-up" data-aos-duration="1000">
                {{
                  is404
                    ? "The requested page does not exist"
                    : "The server encountered an error"
                }}
              </p>
              <div
                data-aos="fade-up"
                data-aos-duration="1500"
                class="fzf-button"
              >
                <a href="/" class="button ac-button is-primary is-medium">
                  Go To Home
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6 is-offset-1 has-text-right-desktop">
          <div class="fzf-right-content-wrapper">
            <img
              class="animation-infinity"
              src="/images/404/man.png"
              alt=""
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.fzf-wrapper.fzf-bg {
  background-image: url('/images/404/404-bg.png');
}
</style>
