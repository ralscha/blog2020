function factorialize(num) {
  
  if (num === 0 || num === 1) {
    return 1;
  }
  
  var result = new java.math.BigDecimal(String(num));
  for (var i = num - 1; i >= 1; i--) {
    result *= i;
  }
  
  return result.toString();

}