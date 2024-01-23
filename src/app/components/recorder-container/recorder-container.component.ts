import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecorderButtonComponent } from '../recorder-button/recorder-button.component';

@Component({
  selector: 'recorder-container',
  standalone: true,
  imports: [CommonModule, RecorderButtonComponent],
  templateUrl: './recorder-container.component.html',
  styleUrl: './recorder-container.component.scss',
})
export class RecorderContainerComponent {
  mediarecorder: MediaRecorder | undefined;
  public isRecording: boolean = false;

  public async recording() {
    const media = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: { frameRate: { ideal: 30 } },
    });
    this.mediarecorder = new MediaRecorder(media, {
      mimeType: 'video/webm;codecs=vp8,opus',
      audioBitsPerSecond: 128000,
    });
    this.mediarecorder.start();
    this.isRecording = true;

    const [video] = media.getVideoTracks();
    video.addEventListener('ended', () => {
      if (this.mediarecorder) {
        this.mediarecorder.stop();
      }
    });

    this.mediarecorder.addEventListener('dataavailable', (e) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(e.data);
      link.download = 'captura.webm';
      link.click();
    });
    this.isRecording = false;
  }

  public stopRecording() {
    if (this.mediarecorder) {
      this.mediarecorder.stop();
      this.mediarecorder = undefined;
    }
  }
}
