import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RecorderButtonComponent } from '../recorder-button/recorder-button.component';

@Component({
  selector: 'recorder-container',
  standalone: true,
  imports: [CommonModule, RecorderButtonComponent],
  templateUrl: './recorder-container.component.html',
  styleUrl: './recorder-container.component.scss',
})
export class RecorderContainerComponent {
  @ViewChild('preview') public preview?: ElementRef;
  @ViewChild('download') public download?: ElementRef;

  private mediarecorder: MediaRecorder | undefined;
  public isRecording: boolean = false;

  public existURL: boolean = false;

  public constraints = {
    audio: true,
    // video: true,
  };

  public async recording() {
    try {
      // Obetenemos los dispotistivos de entrada audio y video
      const userMedia = await navigator.mediaDevices.getUserMedia(
        this.constraints
      );

      //Obtenemos la ventana a compartir
      const media = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: { frameRate: { ideal: 30 } },
      });

      //Combinamos los dos streams audio y ventana
      const tracks = [...media.getTracks(), ...userMedia.getTracks()];

      const combinedStream = new MediaStream(tracks);

      this.mediarecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus',
        audioBitsPerSecond: 128000,
      });
      this.mediarecorder.start();
      this.isRecording = true;

      const [video] = media.getVideoTracks();
      video.addEventListener('ended', () => {
        if (this.mediarecorder) {
          this.mediarecorder.stop();
          this.isRecording = false;
        }
      });

      this.mediarecorder.addEventListener('dataavailable', (e) => {
        const url = URL.createObjectURL(e.data);

        if (this.preview) {
          this.preview.nativeElement.src = url;
          this.preview.nativeElement.play();
        }
        if (this.download) {
          this.download.nativeElement.href = url;
        }
      });
      this.isRecording = false;
      this.existURL = true;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  public stopRecording() {
    if (this.mediarecorder) {
      this.mediarecorder.stop();
      this.mediarecorder = undefined;
    }
  }
}
