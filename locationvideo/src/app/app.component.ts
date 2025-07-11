import {Component, OnInit, viewChild} from '@angular/core';
import {GoogleMap, MapAdvancedMarker, MapInfoWindow} from '@angular/google-maps';
import {YouTubePlayer} from '@angular/youtube-player';

type MarkerObject = {
  option: google.maps.marker.AdvancedMarkerElementOptions,
  videoId: string,
  info: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [GoogleMap, MapAdvancedMarker, MapInfoWindow, YouTubePlayer]
})
export class AppComponent implements OnInit {

  readonly infoWindow = viewChild.required(MapInfoWindow);

  videoId: string | null = null;

  readonly youtubePlayer = viewChild.required(YouTubePlayer);

  markers: MarkerObject[] = [{
    option: {title: 'Paradise Beach', position: {lat: 13.6131648, lng: 98.1379005}},
    videoId: '85tl3vKF6sw',
    info: 'Paradise Beach, one of the most pristine beach in Myanmar'
  }, {
    option: {title: 'Hpa-An / Mawlamyine', position: {lat: 16.8841401, lng: 97.6160162}},
    videoId: 'vnWP7rhHAJU',
    info: 'Aerial view of Hpa-An and Mawlamyine.'
  }, {
    option: {title: 'Balloon Flight Over Bagan', position: {lat: 21.1722165, lng: 94.8544872}},
    videoId: '8epwUR6BBos',
    info: 'The sunrise view from hot air balloon of thousands of temples ' +
      'spread in the Bagan valley is one of the most impressive views to enjoy.\n' +
      'Bagan was the capital of the first Myanmar (Burma) kingdom from ' +
      'the 9th to 13th centuries. It has the largest concentration of Buddhist temples ' +
      'and ruins in the world. At its highest point, the area had more ' +
      'than 10 thousand temples, of which less than 3 thousand remain today.'
  }, {
    option: {title: 'Inle lake', position: {lat: 20.5386148, lng: 96.8683299}},
    videoId: 'xPc7nnIQTE8',
    info: 'Aerial view over Inle lake'
  }, {
    option: {title: 'Ngapali', position: {lat: 18.3962266, lng: 94.335431}},
    videoId: 'D-qP8DKShME',
    info: 'Drone shot'
  }, {
    option: {title: 'Mandalay', position: {lat: 21.9405043, lng: 96.0057839}},
    videoId: 'HabG0k6Ycvw',
    info: 'Aerial view over Mandalay'
  }, {
    option: {title: 'Ngwesaung', position: {lat: 16.8470097, lng: 94.3531173}},
    videoId: 'Y71gP5xJCAo',
    info: 'January 2019 aerial footage of Ngwe Saung beach near Ngwe Saung Yacht Club and flight over ' +
      'Lovers island. It shows fishermen boats in their natural and beautiful environment'
  }, {
    option: {title: 'Yangon', position: {lat: 16.8394236, lng: 96.0414871}},
    videoId: 'WSNFKddtle0',
    info: 'Yangon city drone video. Shots were recorded between 14th and 17th November 2019.'
  }, {
    option: {title: 'Golden Rock', position: {lat: 17.4818254, lng: 97.0976312}},
    videoId: 'hDMuCbtgOgI',
    info: 'The Golden Rock is one of the most important Buddhist sites in Myanmar. The huge bolder, ' +
      'covered with golden leaf, is balancing on the edge of a rock since antiquity. ' +
      'Small pagoda (Kyaiktiyo Pagoda - 7 meters/24 ft) is built on top of the boulder. ' +
      'The site is at elevation of 1,100 metres / 3,600 ft.'
  }, {
    option: {title: 'Popa Taung Kalat', position: {lat: 20.9129914, lng: 95.1999182}},
    videoId: 'opAPwEN6bIQ',
    info: 'The sacred Popa Taung Kalat monastery sits incredibly atop a huge rocky outcrop. 777 ' +
      'steps lead to the top, offering stunning views of the surrounding plains and Mount Popa. ' +
      'Taung Kalat is one of the most sacred places in Myanmar. In addition to the Buddhist monastery, ' +
      'there are several Nat shrines (dedicated to spirits, worshipped in the country).'
  }, {
    option: {title: 'Naypyitaw', position: {lat: 19.7470771, lng: 96.0533896}},
    videoId: 'LAbaIi1bngc',
    info: 'Aerial view of Naypyitaw.'
  }];

  center = {lat: 19.689138, lng: 95.970246};
  zoom = 6;
  info: string | null = null;

  ngOnInit(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  openInfoWindow(markerElement: MapAdvancedMarker, marker: MarkerObject): void {
    const youtubePlayer = this.youtubePlayer();
    if (youtubePlayer
      && youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      youtubePlayer.stopVideo();
    }

    this.videoId = marker.videoId;
    this.info = marker.info;
    this.infoWindow().open(markerElement);
  }

  onReady(event: YT.PlayerEvent): void {
    event.target.playVideo();
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    if (event.data === YT.PlayerState.CUED) {
      event.target.playVideo();
    }
  }
}
