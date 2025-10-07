package com.lngbaotran.lab306.controller;

import com.lngbaotran.lab306.model.Device;
import com.lngbaotran.lab306.repository.DeviceRepository;
import com.lngbaotran.lab306.service.MqttGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/devices")
public class DeviceController {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private MqttGateway mqttGateway;

    /** Lấy danh sách thiết bị */
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    /** Đăng ký thiết bị mới */
    @PostMapping
    public Device addDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    /** Điều khiển thiết bị */
    @PostMapping("/{id}/control")
    public String controlDevice(@PathVariable Long id, @RequestBody CommandRequest request) {
    Device device = deviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Device not found"));

    // cập nhật trạng thái
    device.setStatus(request.getCommand());
    deviceRepository.save(device);

    // publish MQTT theo topic trong DB
    String topic = device.getTopic();
    mqttGateway.sendToMqtt(request.getCommand(), topic);

    return "Command '" + request.getCommand() + "' sent to device " + device.getName();
    }

    // class phụ để nhận JSON {"command": "ON"}
    public static class CommandRequest {
        private String command;
        public String getCommand() { return command; }
        public void setCommand(String command) { this.command = command; }
    }
}
