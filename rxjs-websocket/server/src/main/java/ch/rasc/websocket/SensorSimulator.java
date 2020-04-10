package ch.rasc.websocket;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class SensorSimulator {

  private final RegistryHandler registryHandler;

  private final Random random;

  public SensorSimulator(RegistryHandler registryHandler) {
    this.registryHandler = registryHandler;
    this.random = new Random();
  }

  private final static BigDecimal minTemp = new BigDecimal("-20");
  private final static BigDecimal maxTemp = new BigDecimal("50");

  @Scheduled(fixedRate = 5_000)
  public void generateTemperatureData() {
    this.registryHandler.sendTo("temp",
        new TemperatureSensorData("sensor1", randomBigDecimal(minTemp, maxTemp)));
  }

  @Scheduled(fixedRate = 7_000)
  public void generateHumidtyData() {
    this.registryHandler.sendTo("hum",
        new HumiditySensorData("sensor2", this.random.nextInt(101)));
  }

  private static BigDecimal randomBigDecimal(BigDecimal min, BigDecimal max) {
    BigDecimal randomBigDecimal = min
        .add(new BigDecimal(Math.random()).multiply(max.subtract(min)));
    return randomBigDecimal.setScale(2, RoundingMode.HALF_UP);
  }

}
