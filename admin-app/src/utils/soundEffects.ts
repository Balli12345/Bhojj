/**
 * Pure Web Audio API Sound Synthesizer
 * Zero external audio assets required. Completely resilient and instant.
 */

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check localStorage for mute preference
    const savedMute = localStorage.getItem('bhojj_audio_muted');
    this.isMuted = savedMute === 'true';
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('bhojj_audio_muted', muted ? 'true' : 'false');
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Urgent high-priority double bell chime for Restaurant Incoming Orders
   * Simulates Swiggy/Zomato merchant incoming order alert.
   */
  public playNewOrderAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      // Tone 1: 880Hz (A5)
      this.playBeep(880, now, 0.18, 'sine');
      // Tone 2: 1174Hz (D6)
      this.playBeep(1174, now + 0.12, 0.25, 'triangle');
      // Tone 3: 880Hz
      this.playBeep(880, now + 0.35, 0.18, 'sine');
      // Tone 4: 1318Hz (E6)
      this.playBeep(1318, now + 0.48, 0.35, 'triangle');
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Pleasant rising tri-tone chime for Customer Delivery Updates
   * Simulates delivery notification (Do-Mi-Sol).
   */
  public playDeliveryStatusAlert() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      // C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
      this.playBeep(523.25, now, 0.15, 'sine');
      this.playBeep(659.25, now + 0.12, 0.15, 'sine');
      this.playBeep(783.99, now + 0.24, 0.35, 'sine');
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Celebratory arpeggio when a promo coupon is applied
   */
  public playCouponSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      
      this.playBeep(587.33, now, 0.12, 'sine'); // D5
      this.playBeep(739.99, now + 0.1, 0.12, 'sine'); // F#5
      this.playBeep(880.00, now + 0.2, 0.12, 'sine'); // A5
      this.playBeep(1174.66, now + 0.3, 0.28, 'triangle'); // D6
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Sparkling coin drop chime for Wallet Money Added
   */
  public playWalletSuccess() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      this.playBeep(987.77, now, 0.08, 'sine'); // B5
      this.playBeep(1318.51, now + 0.07, 0.12, 'triangle'); // E6
      this.playBeep(1975.53, now + 0.16, 0.3, 'sine'); // B6
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Crisp swift confirmation for 1-Click Wallet Checkout
   */
  public playWalletPayment() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      this.playBeep(659.25, now, 0.1, 'sine'); // E5
      this.playBeep(1046.50, now + 0.08, 0.22, 'triangle'); // C6
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Elegant chime for booking table reservation & generic success
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      this.playBeep(523.25, now, 0.12, 'sine'); // C5
      this.playBeep(659.25, now + 0.1, 0.12, 'sine'); // E5
      this.playBeep(783.99, now + 0.2, 0.15, 'sine'); // G5
      this.playBeep(1046.50, now + 0.3, 0.25, 'triangle'); // C6
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  }

  /**
   * Table reservation bell chime alert for dining halls
   */
  public playTableBookingAlert() {
    this.playSuccessChime();
  }

  private playBeep(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const soundEffects = new SoundEffectsService();
