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
  private var fdMap = mutableMapOf<String, Int>()

  fun initMonitor() {
    if (Build.VERSION.SDK_INT < VERSION_CODES.O) {
      return
    }
    thread(start = true, isDaemon = false, name = FdMonitor::class.java.name) {
      Thread.sleep(1_000)
      parseFd()
      printFdStatistic(fdMap)
    }
  }

  @RequiresApi(VERSION_CODES.O)
  private fun parseFd() {
    val fdDir = File(getFdDir())
    fdDir.listFiles()
        .map { safeGetRealPath(it) }
        .filter { !it.isNullOrBlank() }
        .forEach {
          val count = fdMap.getOrDefault(it!!, 0)
          fdMap[it] = count + 1
        }
  }

  private fun printFdStatistic(fdData: Map<String, Int>) {
    Log.i(FdMonitor::class.java.name, "----------------------------")
    var amount = 0
    fdData.keys.forEach {
      Log.i(FdMonitor::class.java.name, "fd=${it} count=${fdData[it]}")
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
      null
    }
  }

  private fun getFdDir(): String {
    return "${File.separator}$PROC${File.separator}${Process.myPid()}${File.separator}$FD"
  }
}