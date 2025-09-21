import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
    selector: 'video-player',
    templateUrl: './video-player.component.html',
    styleUrls: [
        './video-player.component.css'
    ],
    encapsulation: ViewEncapsulation.None,
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
    @ViewChild('target', {static: true})
    target: ElementRef;

    // See options: https://videojs.com/guides/options
    @Input()
    options: {
        fill: boolean,
        autoplay: boolean,
        muted: boolean,
        controls: boolean
    };

    @Input()
    videoUrl: string;

    @Output()
    videoLoaded = new EventEmitter<Player>();

    player: Player;

    ngOnInit(): void {
        this.player = videojs(this.target.nativeElement, this.options);

        this.player.on('ready', () => {
            this.player.src({
                src: this.videoUrl,
                type: 'application/x-mpegURL',
            });
        });

        this.player.on('loadeddata', () => {
            this.videoLoaded.emit(this.player);
        });
    }

    ngOnDestroy(): void {
        if (this.player) {
            this.player.dispose();
        }
    }
}
