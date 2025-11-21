<script>
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";

  // ข้อมูลเริ่มต้น (ใช้ตอนก่อนโหลดจาก backend เสร็จ)
  let recipientName = "พี่ดาว";
  let senderName = "ขุมทรัพย์";
  let letterMessage =
    "อันดับแรกผมอยากขอบคุณพี่ดาวจากใจจริงเลยครับ ตั้งแต่เรื่องที่ช่วยส่งเงินให้ทั้งรายวันและรายเดือน ผมรับรู้และซาบซึ้งมากจริงๆ ครับ จริงๆ แล้วผมไม่อยากรบกวนเลย แต่ก็ต้องยอมรับว่าค่าใช้จ่ายในแต่ละวันของผมค่อนข้างเยอะ ผมเองก็พยายามประคองและปรับตัวให้ใช้จ่ายอย่างดีที่สุดในทุกวัน และถ้าไม่มีพี่ดาวคอยช่วยเหลือ ผมคงลำบากมากกว่านี้จริงๆครับ ผมอยากบอกพี่ดาวไว้ตรงนี้เลยว่า เมื่อไหร่ที่ผมสามารถหางานได้ มีงานมั่นคง มีรายได้ของตัวเอง ผมจะกลับมาตอบแทนความช่วยเหลือทั้งหมดที่พี่มีให้ผมอย่างแน่นอนครับ ผมสัญญาเลยครับ ในวันเกิดปีนี้ ขุมทรัพย์ขอให้พี่ดาวมีความสุขมากๆ ในทุกๆวัน ขอให้สมหวังในทุกสิ่งที่ตั้งใจไว้ ขอให้มีสุขภาพที่แข็งแรง ยิ้มได้อย่างสดใสในทุกวัน และขอให้ฐานะการเงินมั่นคง เจริญรุ่งเรืองขึ้นเรื่อยๆนะครับ 💛✨";

  let isLoadingLetter = true;
  let isEnvelopeOpened = false;

  // transition รวม fade + fly
  function fadeFly(node, { delay = 0, y = 14, duration = 400 } = {}) {
    return {
      delay,
      duration,
      easing: cubicOut,
      css: (t) => `
        opacity: ${t};
        transform: translateY(${(1 - t) * y}px);
      `,
    };
  }

  // โหลดจดหมายจาก backend
  onMount(async () => {
    try {
      const response = await fetch("http://localhost:3000/api/letter");
      if (response.ok) {
        const data = await response.json();
        recipientName = data.recipientName ?? recipientName;
        senderName = data.senderName ?? senderName;
        letterMessage = data.letterMessage ?? letterMessage;
      }
    } catch (error) {
      console.error("โหลดจดหมายไม่สำเร็จ:", error);
      // ถ้า error ก็ใช้ข้อความ default ด้านบนต่อไป
    } finally {
      isLoadingLetter = false;
    }
  });

  function toggleEnvelope() {
    isEnvelopeOpened = !isEnvelopeOpened;
  }
</script>

<main class="page">
  <!-- พื้นหลังทะเลยามพระอาทิตย์ตก -->
  <div class="sea-bg">
    <div class="sea-gradient"></div>
    <div class="sea-wave wave-1"></div>
    <div class="sea-wave wave-2"></div>
  </div>

  <section class="layout">
    <header class="top-bar">
      <div class="brand">
        <div class="brand-mark">
          <img src="/Me.jpg" alt="profile" />
        </div>
        <div class="brand-text">
          <span class="brand-name">This letter is sending to P'Dao</span>
          <span class="brand-tagline">By Sukhum (Khumsup)</span>
        </div>
      </div>

      <div class="chip">28 Nov 2025</div>
    </header>

    <section class="content">
      <!-- ฝั่งซองจดหมาย -->
      <div class="left">
        <p class="intro">
          มีคำอวยพรเล็กๆน้อยๆมาให้ครับ<br />
          <span class="highlight">{recipientName} !! </span>
        </p>

        <div
          class="envelope-wrapper {isEnvelopeOpened ? 'opened' : ''}"
          role="button"
          tabindex="0"
          aria-pressed={isEnvelopeOpened}
          on:click={toggleEnvelope}
          on:keydown={(e) => {
            if (
              e.key === "Enter" ||
              e.key === " " ||
              e.key === "Spacebar" ||
              e.key === "Space"
            ) {
              e.preventDefault();
              toggleEnvelope();
            }
          }}
        >
          <div class="envelope">
            <div class="envelope-back"></div>
            <div class="envelope-flap"></div>
            <div class="envelope-front"></div>

            <!-- การ์ดด้านใน -->
            <div class="letter">
              <div class="letter-inner">
                <h2>ถึง {recipientName}</h2>

                {#if isLoadingLetter}
                  <p class="muted">กำลังให้คลื่นลมช่วยพัดข้อความมาหาอยู่...</p>
                {:else}
                  <p
                    class="letter-message"
                    transition:fadeFly={{ y: 18, duration: 450 }}
                  >
                    {letterMessage}
                  </p>
                {/if}

                <p class="signature">
                  ด้วยความห่วงใยจาก<br />
                  <span>{senderName}</span>
                </p>
              </div>
            </div>
          </div>

          <button class="envelope-hint">
            {#if isEnvelopeOpened}
              เป็นคำอวยพรจากผมเองครับ!!
            {:else}
              ลองเปิดดูได้เลยครับ!!
            {/if}
          </button>
        </div>

        <div class="inputs">
          <label>
            ถึง:
            <input bind:value={recipientName} placeholder="เช่น พี่ดาว" />
          </label>
          <label>
            จาก:
            <input bind:value={senderName} placeholder="เช่น ขุมทรัพย์" />
          </label>
        </div>
      </div>

      <!-- ฝั่งรูปคลินิกริมทะเลยามเย็น -->
      <div class="right">
        <div class="photo-card">
          <div class="photo-frame">
            <img
              src="/sea-clinic.jpg"
              alt="Sunset seaside clinic"
              on:error={(e) => (e.currentTarget.src = "Memory.jpg")}
              loading="lazy"
            />
          </div>
          <div class="photo-text">
            <h3>"ผมไม่มีวันลืมรูปภาพและความทรงจำนี้แน่นอนครับ"</h3>
            <p>⭐ ขอบคุณพี่ดาวที่คอยช่วยเหลือขุมทรัพย์มาตลอดนะครับ ⭐</p>
            <div class="badges">
              <span>#สุขสันต์วันเกิด</span>
              <span>#HBD</span>
              <span>#Happy Birthday kub!!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</main>

<style>
  /* เสริมสไตล์เฉพาะข้อความจดหมาย (ใช้ร่วมกับ style.css เดิม) */
  .letter-message {
    font-size: 0.92rem;
    line-height: 1.6;
    color: #4b5563;
    white-space: pre-line;
  }
</style>
