// map.component.ts
import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { defaults as defaultControls, Zoom } from 'ol/control';
import { easeOut } from 'ol/easing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPlus, faMinus, faCrosshairs, faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone : false
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapDiv!: ElementRef;
  map!: Map;
  private defaultCenter = fromLonLat([10.1658, 36.81897]);
  private defaultZoom = 12;

  constructor(private library: FaIconLibrary) {
    library.addIcons(faPlus, faMinus, faCrosshairs);
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = new Map({
      target: this.mapDiv.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: this.defaultCenter,
        zoom: this.defaultZoom,
        minZoom: 8,
        maxZoom: 18
      }),
      controls: defaultControls({
        zoom: false,
        rotate: false
      })
    });
  }

  zoomIn(): void {
    const view = this.map.getView();
    const currentZoom = view.getZoom() || this.defaultZoom;
    view.animate({
      zoom: currentZoom + 1,
      duration: 300,
      easing: easeOut
    });
  }

  zoomOut(): void {
    const view = this.map.getView();
    const currentZoom = view.getZoom() || this.defaultZoom;
    view.animate({
      zoom: currentZoom - 1,
      duration: 300,
      easing: easeOut
    });
  }

  resetView(): void {
    this.map.getView().animate({
      center: this.defaultCenter,
      zoom: this.defaultZoom,
      duration: 500
    });
  }
}