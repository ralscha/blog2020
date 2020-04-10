package ch.rasc.websocket;

public class HumiditySensorData {

  private final long ts;

  private final String name;

  private final int humidity;

  public HumiditySensorData(String name, int humidity) {
    this.ts = System.currentTimeMillis() / 1000;
    this.name = name;
    this.humidity = humidity;
  }

  public int getHumidity() {
    return this.humidity;
  }

  public long getTs() {
    return this.ts;
  }

  public String getName() {
    return this.name;
  }

}
