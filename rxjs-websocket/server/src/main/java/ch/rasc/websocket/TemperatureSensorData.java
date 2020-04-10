package ch.rasc.websocket;

import java.math.BigDecimal;

public class TemperatureSensorData {

  private final long ts;

  private final String name;

  private final BigDecimal temperature;

  public TemperatureSensorData(String name, BigDecimal temperature) {
    this.ts = System.currentTimeMillis() / 1000;
    this.name = name;
    this.temperature = temperature;
  }

  public BigDecimal getTemperature() {
    return this.temperature;
  }

  public long getTs() {
    return this.ts;
  }

  public String getName() {
    return this.name;
  }

}
