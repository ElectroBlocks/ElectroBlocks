<!-- src/routes/firmware/python/+page.svelte -->
<script lang="ts">
  import { MicroControllerType } from "../../../core/microcontroller/microcontroller";
  import arduinoStore from "../../../stores/arduino.store";

  type FirmwareFlag = {
    id: string;          // macro id (what you’ll pass to build/upload)
    label: string;       // UI label
    description?: string;
    category: string;    // for grouping
    defaultOn?: boolean;
  };

  const flags: FirmwareFlag[] = [
    { id: 'ENABLE_RFID_UART', label: 'RFID (UART)', description: 'SoftwareSerial', category: 'Sensors' },
    { id: 'ENABLE_DHT', label: 'DHT Temperature/Humidity', description: 'DHT11 / DHT22', category: 'Sensors' },
    { id: 'ENABLE_IR_REMOTE', label: 'IR Remote', description: 'IR receiver + remote control', category: 'Sensors' },
    { id: 'ENABLE_LCD', label: 'LCD (I2C)', description: '16x2 / 20x4 LCD via I2C', category: 'Displays' },
    { id: 'ENABLE_LED_MATRIX', label: 'LED Matrix', description: 'MAX7219 / MD_MAX72XX', category: 'Displays' },
    { id: 'ENABLE_TM', label: '4-Digit Display (TM1637)', description: 'TM1637 digital display', category: 'Displays' },
    { id: 'ENABLE_LED_STRIP', label: 'RGB LED Strip', description: 'NeoPixel / FastLED (limited)', category: 'Outputs' },
    { id: 'ENABLE_SERVO', label: 'Servo', description: 'Servo motor control', category: 'Outputs' },
    { id: 'ENABLE_STEPPER', label: 'Stepper', description: 'Stepper motor control', category: 'Outputs' },
    { id: 'ENABLE_MOTOR', label: 'Motor Driver', description: 'Basic DC motor driver control', category: 'Outputs' },
    { id: 'ENABLE_BUZZER', label: 'Buzzer', description: 'Tone / simple buzzer', category: 'Outputs' }
  ];


const boards: { id: MicroControllerType; label: string; description: string }[] = [
  {
    id: MicroControllerType.ARDUINO_UNO,
    label: 'Arduino Uno',
    description: 'ATmega328P • Limited memory • Recommended for simple builds'
  },
  {
    id: MicroControllerType.ARDUINO_MEGA,
    label: 'Arduino Mega',
    description: 'ATmega2560 • More memory • Recommended for many components'
  }
];

  let selectedBoard = MicroControllerType.ARDUINO_UNO;

    $: boardLabel = boards.find(b => b.id === selectedBoard)?.id;


  const categories = Array.from(new Set(flags.map(f => f.category)));

  // state: selected flags
  let selected: Record<string, boolean> = Object.fromEntries(
    flags.map(f => [f.id, !!f.defaultOn])
  );

  let isUploading = false;
  let status: 'idle' | 'ok' | 'error' = 'idle';
  let message = '';

  function toggleCategory(category: string, value: boolean) {
    for (const f of flags) {
      if (f.category === category) selected[f.id] = value;
    }
    // force Svelte reactivity for object mutation
    selected = { ...selected };
  }

  function selectAll(value: boolean) {
    for (const f of flags) selected[f.id] = value;
    selected = { ...selected };
  }

  $: enabledIds = flags.filter(f => selected[f.id]).map(f => f.id);
  $: enabledLabels = flags.filter(f => selected[f.id]).map(f => f.label);

  async function onUpload() {
    status = 'idle';
    message = '';
    isUploading = true;

    try {
      await upload(enabledIds);

      status = 'ok';
      message = 'You flashed your firmware!';
    } catch (err) {
      status = 'error';
      message = err instanceof Error ? err.message : 'Upload failed.';
    } finally {
      isUploading = false;
    }
  }

  // placeholder to show loading state works
  async function upload(_enabled: string[]) {
    await arduinoStore.connectWithAndUploadFirmware(selectedBoard, _enabled);
  }
</script>

<svelte:head>
  <title>Python Firmware Uploader</title>
</svelte:head>

<div class="page">
  <header class="header">
    <h1>Python Firmware Uploader</h1>
    <p class="sub">
      Pick the firmware features you want enabled, then upload. (Advanced)
    </p>
  </header>
  <section class="card">
  <h2>Board Type</h2>

  <label class="select-label">
    <span class="select-title">Target board</span>

    <select
      bind:value={selectedBoard}
      class="select"
      aria-label="Select board type"
    >
      {#each boards as board}
        <option value={board.id}>
          {board.label}
        </option>
      {/each}
    </select>
  </label>

  <p class="select-desc">
    {boards.find(b => b.id === selectedBoard)?.description}
  </p>
</section>


  <section class="card">
    <div class="toolbar">
      <div class="toolbar-left">
        <button type="button" class="btn ghost" on:click={() => selectAll(false)}>
          Select none
        </button>
      </div>

      <div class="toolbar-right">
        <span class="pill">
          {enabledIds.length} selected
        </span>
      </div>
    </div>

    {#each categories as category}
      <div class="group">
        <div class="group-header">
          <h2>{category}</h2>
          <div class="group-actions">
            <button
              type="button"
              class="btn small ghost"
              on:click={() => toggleCategory(category, true)}
            >
              All
            </button>
            <button
              type="button"
              class="btn small ghost"
              on:click={() => toggleCategory(category, false)}
            >
              None
            </button>
          </div>
        </div>

        <div class="grid">
          {#each flags.filter(f => f.category === category) as f (f.id)}
            <label class="item">
              <input
                type="checkbox"
                bind:checked={selected[f.id]}
                on:change={() => (selected = { ...selected })}
              />
              <div class="item-text">
                <div class="item-title">{f.label}</div>
                {#if f.description}
                  <div class="item-desc">{f.description}</div>
                {/if}
                <div class="item-id">{f.id}</div>
              </div>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </section>

  <section class="card">
    <h2>Summary</h2>

    {#if enabledLabels.length === 0}
      <p class="muted">Select at least one feature to enable.</p>
    {:else}
      <ul class="summary">
        {#each enabledLabels as label}
          <li>{label}</li>
        {/each}
      </ul>
    {/if}

    <div class="actions">
      <button class="btn primary" type="button" disabled={isUploading} on:click={onUpload}>
        {#if isUploading}
          Uploading…
        {:else}
          Upload Firmware
        {/if}
      </button>
    </div>

    {#if status !== 'idle'}
      <div class="status {status}">
        <strong>{status === 'ok' ? 'OK' : 'Error'}:</strong> {message}
      </div>
    {/if}

    <details class="debug">
      <summary>Firmware Features</summary>
      <pre>{JSON.stringify({ enabledIds }, null, 2)}</pre>
    </details>
  </section>
</div>

<style>
  .page {
    max-width: 100wv;
    margin: 0 auto;
    padding: 24px 16px 48px;
    overflow: scroll;
    height: 100vh;
  }

  .header h1 {
    margin: 0 0 6px 0;
    font-size: 28px;
    line-height: 1.2;
  }

  .sub {
    margin: 0 0 18px 0;
    color: rgba(0, 0, 0, 0.65);
  }

  .card {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 14px;
    padding: 16px;
    background: white;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.04);
    margin-bottom: 16px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .pill {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 0, 0, 0.03);
  }

  .group {
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    margin-top: 10px;
  }

  .group:first-of-type {
    border-top: none;
    margin-top: 0;
    padding-top: 0;
  }

  .group-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }

  .group-header h2 {
    margin: 0;
    font-size: 16px;
  }

  .group-actions {
    display: flex;
    gap: 6px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  @media (max-width: 760px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  .item {
    display: flex;
    gap: 10px;
    border: 1px solid rgba(0, 0, 0, 0.10);
    border-radius: 12px;
    padding: 10px;
    cursor: pointer;
    user-select: none;
  }

  .item:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  .item input {
    margin-top: 3px;
  }

  .item-title {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .item-desc {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.65);
    margin-bottom: 4px;
  }

  .item-id {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.55);
  }

  .btn {
    border: 1px solid rgba(0, 0, 0, 0.14);
    background: white;
    border-radius: 10px;
    padding: 10px 12px;
    cursor: pointer;
    font-weight: 600;
  }

  .btn:hover:enabled {
    background: rgba(0, 0, 0, 0.03);
  }

  .btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .btn.small {
    padding: 6px 10px;
    font-size: 13px;
  }

  .btn.ghost {
    background: transparent;
  }

  .btn.primary {
    border-color: rgba(0, 0, 0, 0.2);
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    flex-wrap: wrap;
  }

  .muted {
    color: rgba(0, 0, 0, 0.6);
  }

  .summary {
    margin: 8px 0 0 18px;
  }

  .status {
    margin-top: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(0, 0, 0, 0.02);
  }

  .status.ok {
    border-color: rgba(0, 128, 0, 0.25);
  }

  .status.error {
    border-color: rgba(200, 0, 0, 0.25);
  }

  .debug {
    margin-top: 12px;
  }

  pre {
    margin: 10px 0 0 0;
    padding: 12px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.04);
    overflow: auto;
  }

  .select-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 420px;
}

.select-title {
  font-weight: 600;
}

.select {
  appearance: none;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.select:hover {
  background: rgba(0, 0, 0, 0.03);
}

.select-desc {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 6px;
}
</style>
