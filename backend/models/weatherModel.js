class WeatherModel {
    constructor(city, temp, feelsLike, weatherDescription, time) {
        this.city = city;
        this.temp = temp;
        this.feelsLike = feelsLike;
        this.weatherDescription = weatherDescription;
        this.time = time;
    }
}

module.exports = WeatherModel;
