---
theme: default
title: "Effect in practice - SoCraTes 2026 Workshop"
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: light
fonts:
  sans: Inter
  serif: Inter
  mono: Fira Code
exportFilename: effect-workshop-socrates-2026.pdf
---

# Effect in practice

Building a type-safe, composable, and robust HTTP API in TypeScript

<h2 class="author">
  Cosimo Matteini • <img src="/doubleloop.png" class="ml-2 h-8 self-end">
</h2>

---

# Effect in practice - Setup repository

- Download `Node.js` v24 or later
- Download `pnpm` v11 package manager
- Clone repository https://github.com/doubleloop-io/effect-workshop-socrates-2026
    - Run `pnpm install`
    - Run `pnpm run test:api:e2e` and verify all 8 tests are failing

---

# Agenda

- What is Effect?
- Part 1: Effect basics
- Coffee Break
- Part 2: Building an HTTP API with Effect

---

# What is Effect?

<div>
    <img src="/effect.svg" class="inline" style="height: 0.93em; vertical-align: -0.1em"> is a TypeScript library that enables to <b>safely</b> build complex and <b>composable</b> applications.
</div>

<br/>

<div v-click>
    Effect takes a <b>pragmatic</b> approach to functional programming. Rather than being purely academic, it brings core FP
    principles to TypeScript in a way that's <b>accessible</b> and <b>production-ready</b>.
</div>

<br/>

<div v-click>
Key features:

<div class="flex gap-12">
    <ul>
        <li>Type Safety everywhere</li>
        <li>Automatic error tracking</li>
        <li>Error Handling</li>
        <li>Automatic dependency tracking</li>
        <li>Dependency injection</li>
    </ul>
    <ul>
        <li>Composability</li>
        <li>Concurrency</li>
        <li>Resource Safety</li>
        <li>Asynchronicity</li>
        <li>Observability (built-in)</li>
    </ul>
</div>

</div>

---

# A workshop in the AI era?

<div class="ai">

<img width="200" src="/claude.svg" class="">
<img width="200" src="/openai.svg" class="">
<img width="200" src="/opencode.svg" class="">

</div>

---
layout: center
---

# Part 1: Effect basics

---
layout: center
---

# Part 2: Building an HTTP API with Effect

---

# HTTP API Overview

<img src="/http-api-overview.png" class="mt-16">
