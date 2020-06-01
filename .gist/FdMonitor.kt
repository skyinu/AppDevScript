package com.skyinu.wardhere

import android.os.Build
import android.os.Build.VERSION_CODES
import android.os.Process
import android.support.annotation.RequiresApi
import android.util.Log
import java.io.File
import java.lang.Exception
import kotlin.concurrent.thread

object FdMonitor {
  private const val PROC = "proc"
  private const val FD = "fd"
  private const val FD_WARNING = 10
  private var fdMap = mutableMapOf<String, Int>()

  fun initMonitor() {
    if (Build.VERSION.SDK_INT < VERSION_CODES.O) {
      return
    }
    thread(start = true, isDaemon = false, name = FdMonitor::class.java.name) {
      while (true) {
        Thread.sleep(10_000)
        try {
          parseFd()
          printFdStatistic(fdMap)
        } catch (err: Exception) {
          err.printStackTrace()
        }
      }
    }
  }

  @RequiresApi(VERSION_CODES.O)
  private fun parseFd() {
    fdMap.clear()
    val fdDir = File(getFdDir())
    fdDir.listFiles()
        .map { safeGetRealPath(it) }
        .forEach {
          val count = fdMap.getOrDefault(it!!, 0)
          fdMap[it] = count + 1
        }
  }

  private fun printFdStatistic(fdData: Map<String, Int>) {
    Log.i(FdMonitor::class.java.name, "----------------------------")
    var amount = 0
    fdData.keys.forEach {
      if (fdData.getValue(it) >= FD_WARNING) {
        Log.i(FdMonitor::class.java.name, "fd=${it} count=${fdData[it]}")
      }
      amount += (fdData[it] ?: 0)
    }
    Log.i(FdMonitor::class.java.name, "fd amount = $amount")
    Log.i(FdMonitor::class.java.name, "----------------------------")
  }

  @RequiresApi(VERSION_CODES.O)
  private fun safeGetRealPath(item: File): String? {
    return try {
      item.toPath()
          .toRealPath()
          .toAbsolutePath().fileName.toString()
    } catch (err: Exception) {
      "unknowfd"
    }
  }

  private fun getFdDir(): String {
    return "${File.separator}$PROC${File.separator}${Process.myPid()}${File.separator}$FD"
  }
}
