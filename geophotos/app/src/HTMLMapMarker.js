/*
 * https://blackatlascreative.com/blog/custom-clickable-google-map-markers-with-images/
 * https://levelup.gitconnected.com/how-to-create-custom-html-markers-on-google-maps-9ff21be90e4b
 * HTMLMapMarker Javascript class
 * Extends the Google Maps OverlayView class
 * Set up to accept our latlng, html for the div, and the map to attach it to as arguments
 */
export class HTMLMapMarker extends google.maps.OverlayView {
  // Constructor accepting args
  constructor(args) {
    super();
    this.latlng = args.latlng;
    this.html = args.html;
    this.photo = args.photo;
    this.setMap(args.map);
  }

  // Create the div with content and add a listener for click events
  createDiv() {
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    if (this.html) {
      this.div.innerHTML = this.html;
    }
    google.maps.event.addDomListener(this.div, 'click', event => {
      google.maps.event.trigger(this, 'click');
    });
  }

  // Append to the overlay layer
  // Appending to both overlayLayer and overlayMouseTarget which should allow this to be clickable
  appendDivToOverlay() {
    const panes = this.getPanes();
    panes.overlayLayer.appendChild(this.div);
    panes.overlayMouseTarget.appendChild(this.div);
  }

  // Position the div according to the coordinates
  positionDiv() {
    const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
      this.div.style.left = `${point.x}px`;
      this.div.style.top = `${point.y}px`;
    }
  }

  // Create the div and append to map
  draw() {
    if (!this.div) {
      this.createDiv();
      this.appendDivToOverlay();
    }
    this.positionDiv();
  }

  // Remove this from map
  remove() {
    if (this.div) {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    }
  }

  // Return lat and long object
  getPosition() {
    return this.latlng;
  }

  // Return whether this is draggable
  getDraggable() {
    return false;
  }
}
