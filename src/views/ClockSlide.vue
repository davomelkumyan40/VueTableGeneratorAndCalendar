<template>
  <div class="main">
    <div class="select">
      <select v-model="selectedMode">
        <option disabled value="">Select Time Format</option>
        <option value="24">24 Hour System</option>
        <option value="12">12 Hour System</option>
      </select>
      <input class="inputTime" @input="setAlarmTime" type="text" :placeholder="currentTime" />
      <input class="notice-btn" @click="addAlarm" type="button" value="Add" />
    </div>
    <div class="container">
      <div class="timeCentralLine"></div>
      <div class="curr-time">{{ currentTime }}</div>
      <div class="scroll-container" ref="timeSlide" id="container">
        <div v-for="(t, index) in timeList" :key="index" class="scroll-item" :style="setSlideWidth()"
          :class="{ timeActive: t.isActive }">
          <p>
            {{ t.time }}
          </p>
          <div class="alarmList">
            <div class="nItem" :style="noticeStyle(notice, i, index)" v-for="(notice, i) in t.alarms" :key="i">
              <div @click="removeAlarm(i, index)" class="close">X</div>
              <span>{{ notice }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus
      debitis nisi magnam, fuga rem maiores et repellat neque animi ducimus,
      dolorum non natus iusto! Iste illo maxime vel blanditiis magni vitae
      commodi sapiente aspernatur quos quidem! Consequuntur at repudiandae, ad
      porro perferendis sint cupiditate incidunt assumenda dolore ipsa nulla
      vero obcaecati voluptatibus aperiam nisi facilis accusantium voluptas rem
    </div>
  </div>
</template>

<script>
import { match } from 'assert';

//TODO fix AM PM date doublication
export default {
  data() {
    return {
      timeList: [],
      slideWidth: 200,
      windowWidth: 0,
      currentSlide: 0,
      lastTime: 0,
      slideCount: 0,
      selectedMode: "",
      currentTime: "",
      alarmList: ["04:00"],
      alarmTime: "",
      threadId: -1,
    };
  },
  created() {
    Date.to24HourSystemString = function (time) {
      let hour = parseInt(time.slice(0, 2));
      let minutes = parseInt(time.slice(3, 5));
      const mode = time.slice(6);
      hour =
        mode === "PM"
          ? hour === 12
            ? hour
            : hour + 12
          : hour === 12
            ? 0
            : hour;
      return `${hour < 10 ? "0" + hour : hour}:${minutes ? (minutes < 10 ? "0" + minutes : minutes) : "00"
        }`;
    };
    Date.to12HourSystemString = function (hour, minutes) {
      let m = minutes ? (minutes < 10 ? `0${minutes}` : minutes) : "00";
      if (hour === 12) return `${hour}:${m} PM`;
      if (hour === 0) return `${12}:${m} AM`;
      if (hour > 12) return `${hour - 12 < 10 ? "0" : ""}${hour - 12}:${m} PM`;
      if (hour > 0 && hour < 13)
        return `${hour < 10 ? "0" : ""}${hour}:${m} AM`;
    };
    Date.prototype.timeString = function () {
      const h = this.getHours();
      const m = this.getMinutes();
      return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
    };
    Date.prototype.addHours = function (h) {
      this.setTime(this.getTime() + h * 60 * 60 * 1000);
      return this;
    };
    Date.prototype.takeHours = function (h) {
      this.setHours(this.getHours() - h);
      return this;
    };

    this.updateCurrentTime();
    this.windowWidth = window.innerWidth;
    this.updateScreenSize();
    this.initializeSlider();
    this.currentSlide = new Date().getHours();
    addEventListener("resize", this.resize);
  },

  mounted() {
    this.updateSlider();
    this.threadId = setInterval(() => {
      this.updateSlider();
    }, 1000);
  },
  computed: {},
  watch: {
    selectedMode() {
      this.timeList.length = 0;
      this.initializeSlider();
      this.updateSlider();
      this.updateCurrentTime();
      this.timeList.forEach((x) => {
        x.alarms = [];
      });
      this.alarmList = this.alarmList.map((x) => this.changeFormat(x));
      console.log(this.alarmList);
      this.initializeAlarms();
    },
  },
  beforeUnmount() {
    clearInterval(this.threadId);
  },
  unmounted() {
    removeEventListener("resize", this.resize);
  },
  methods: {
    filteredAlarmList(currentTimeString) {
      return this.alarmList
        .filter((f) => {
          //if 24 format only
          var matched = f.slice(0, 2) === currentTimeString.slice(0, 2);
          if (this.selectedMode === "12")
            matched = f.slice(6, f.length) === currentTimeString.slice(6, currentTimeString.length) && f.slice(0, 2) === currentTimeString.slice(0, 2);
          return matched;
        }).sort();
    },
    resize() {
      this.windowWidth = window.innerWidth;
      this.updateScreenSize();
      this.timeList.length = 0;
      this.initializeSlider();
      this.updateSlider();
    },
    changeFormat(time) {
      let h = parseInt(time.slice(0, 2));
      let m = parseInt(time.slice(3));
      return this.selectedMode === "12"
        ? `${Date.to12HourSystemString(h, m)}`
        : `${Date.to24HourSystemString(time)}`;
    },
    removeAlarm(i1, i2) {
      let remove = this.timeList[i2].alarms.splice(i1, 1)[0];
      this.alarmList.splice(this.alarmList.indexOf(remove), 1);
    },
    updateCurrentTime() {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      switch (this.selectedMode) {
        case "12":
          this.currentTime = Date.to12HourSystemString(h, m);
          break;
        case "24":
          this.currentTime = date.timeString();
          break;
        default:
          this.currentTime = date.timeString();
          break;
      }
    },

    initializeAlarms() {
      this.timeList.forEach((x) => {
        x.alarms = this.filteredAlarmList(x.time);
      });
    },

    addAlarm() {
      if (this.alarmTime) {
        this.alarmList.push(this.alarmTime);
        this.alarmTime = "";
        this.initializeAlarms();
      }
      return;
    },
    setAlarmTime(e) {
      this.alarmTime = e.target.value;
    },
    updateScreenSize() {
      if (this.windowWidth < 1024) this.slideCount = 5; // 1K
      if (this.windowWidth < 1920) this.slideCount = 10; // 2K
      if (this.windowWidth < 3840) this.slideCount = 12; // 4K
    },

    updateSlider() {
      let date = new Date();
      this.updateCurrentTime();
      const container = this.$refs.timeSlide;
      if (this.currentSlide !== date.getHours()) this.slideToNext(date);
      const minutesPercent = (date.getMinutes() / 60) * 100;
      let passedInterval = (this.slideWidth * minutesPercent) / 100;
      container.style.left = `-${this.slideCount * this.slideWidth -
        this.windowWidth / 2 +
        passedInterval
        }px`;
    },

    slideToNext(d) {
      this.currentSlide = d.getHours();
      this.timeList.forEach((e) => {
        if (e.isActive) e.isActive = false;
        if (e.id === this.currentSlide) e.isActive = true;
      });
      this.timeList.shift();
      let f = this.lastTime.getHours();
      let t = "";
      switch (this.selectedMode) {
        case "12":
          t = Date.to12HourSystemString(f);
          break;
        case "24":
          t = this.lastTime.timeString();
          break;
        default:
          t = this.lastTime.timeString();
          break;
      }
      this.timeList.push({
        id: this.lastTime.getHours(),
        time: t,
        alarms: this.filteredAlarmList(t),
        isActive: false,
      });
      this.lastTime.addHours(1);
    },

    initializeSlider() {
      let now = new Date();
      let d = new Date();
      d.setHours(d.takeHours(this.slideCount).getHours(), 0, 0, 0);
      for (let i = 0; i < this.slideCount * 2 + 1; i++) {
        let h = d.getHours();
        let t = "";
        switch (this.selectedMode) {
          case "12":
            t = Date.to12HourSystemString(h);
            break;
          case "24":
            t = d.timeString();
            break;
          default:
            t = d.timeString();
            break;
        }
        this.timeList.push({
          id: h,
          time: t,
          alarms: this.filteredAlarmList(t),
          isActive: now.getHours() === h,
        });
        d.addHours(1);
      }
      this.lastTime = d;
    },

    noticeStyle(time, index, index2) {
      return {
        display: "flex",
        cursor: "pointer",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingLeft: "1.3rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
        position: "absolute",
        left: `${(200 * (parseInt(time.slice(3)) / 60) * 100) / 100}px`,
        zIndex: `${index + index2}`,
        width: "280px",
        height: "136px",
        background: "#fff",
        boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        border: "1px solid gray",
      };
    },
    setSlideWidth() {
      return {
        width: `${this.slideWidth}px`,
      };
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main {
  position: relative;
  height: 100%;
  background-color: rgb(32, 32, 32);
  width: 100%;
  overflow-x: hidden;
}

.select {
  display: flex;
  align-items: flex-start;
}

.select select {
  width: 200px;
  height: 50px;
  border: 1px solid gray;
  font-size: 1.1rem;
  cursor: pointer;
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
  margin-bottom: 20px;
}

.scroll-container {
  background-color: rgb(53, 53, 53);
  position: absolute;
  left: 0;
  height: 400px;
  display: flex;
  flex-direction: row;
  overflow: hidden !important;
}

.inputTime {
  width: 200px;
  height: 50px;
  font-size: 1.1rem;
  border: none;
  padding-left: 15px;
}

.notice-btn {
  height: 50px;
  width: 90px;
  border: none;
  background-color: #454a4d;
  cursor: pointer;
  font-size: 1.1rem;
  transition: 0.3s ease background-color;
}

.notice-btn:hover {
  background-color: #3b3c3d;
}

.alarmList {
  position: absolute;
  left: 0;
  top: 60%;
}

.nItem:hover {
  z-index: 1000 !important;
}

.close {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  right: 0;
  top: 0;
  height: 20px;
  width: 20px;
  font-size: 0.8rem;
  background-color: #131516;
  color: gray;
  cursor: pointer;
  transition: 0.3s ease background-color, color;
}

.close:hover {
  color: #fff;
  background-color: #2b2e2f;
}

.timeCentralLine {
  z-index: 2;
  background-color: white !important;
  width: 2px !important;
  height: 160px;
  position: absolute;
  left: 50%;
}

.curr-time {
  z-index: 2;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 50px;
  width: 100px;
  background-color: #131516;
  position: absolute;
  left: calc(50% - 50px);
  color: white;
  border: 1px solid #fff;
}

.timeCentralLine::before {
  content: "";
  width: 2px !important;
  background-color: #fff !important;
  position: absolute;
  left: 50%;
  margin-top: 240px;
  height: 160px;
}

.scroll-item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  transition-property: left;
  transition-timing-function: linear;
  background-color: rgb(25, 26, 26);
  border-left: 1px solid #fff;
}

.scroll-item>p {
  width: 100%;
  color: #fff;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.timeActive {
  background: rgb(53, 53, 53);
  position: relative;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}
</style>
