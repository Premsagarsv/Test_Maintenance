using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace Vegam_MaintenanceModule.HandlerFiles
{
    /// <summary>
    /// Summary description for DownloadHandler
    /// </summary>
    public class DownloadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            #region Maintenance Info

            #region Functional Location Info
            //Download Functional location Excel file
            if (context.Request.QueryString["FLocationExcelFile"] != null)
            {
                string fLocationExcelInfo = context.Request.QueryString["FLocationExcelFile"];
                DownloadExcelFile(fLocationExcelInfo, context);
                return;
            }
            //Download Functional location template zip file
            if (context.Request.QueryString["FLocationFileName"] != null)
            {
                string fileName = context.Request.QueryString["FLocationFileName"] + ".zip";
                DownloadZipFile(fileName, context);
                return;
            }
            //Download Functional location log file
            if (context.Request.QueryString["FunctionalLocationLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["FunctionalLocationLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }

            #endregion

            #region Equipment Info Downlaod
            //Download Equipment template zip file
            if (context.Request.QueryString["EquipmentFileName"] != null)
            {
                string equipmentExcelFile = context.Request.QueryString["EquipmentFileName"] + ".zip"; ;
                DownloadExcelFile(equipmentExcelFile, context);
                return;
            }

            //Download Equipment Excel file
            if (context.Request.QueryString["EquipmentInfoFile"] != null)
            {
                string equipmentExcelInfo = context.Request.QueryString["EquipmentInfoFile"];
                DownloadExcelFile(equipmentExcelInfo, context);
                return;
            }

            //Download Equipment Information Log File
            if (context.Request.QueryString["EquipmentLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["EquipmentLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion

            #region Measuring Point Download
            //Download Measuring point template zip file
            if (context.Request.QueryString["MeasuringPointTemplateFileName"] != null)
            {
                string fileName = context.Request.QueryString["MeasuringPointTemplateFileName"] + ".zip";
                DownloadZipFile(fileName, context);
                return;
            }

            //Download Grade Grinding Type Information Excel         
            if (context.Request.QueryString["MeasuringPointInfoExcel"] != null)
            {
                string materialQualityParameterExcelFile = context.Request.QueryString["MeasuringPointInfoExcel"];
                DownloadExcelFile(materialQualityParameterExcelFile, context);
                return;
            }

            //Download Grade Grinding Type Log File
            if (context.Request.QueryString["MeasuringPointInfoLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["MeasuringPointInfoLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion

            #region Document Info Downlaod
            if (context.Request.QueryString["MaintenanceDocsName"] != null && context.Request.QueryString["MaintenanceDocsPath"] != null)
            {
                string fileName = context.Request.QueryString["MaintenanceDocsName"];
                string filePath = context.Request.QueryString["MaintenanceDocsPath"];
                Uri uriPath = new Uri(filePath);
                DownloadDocument(fileName, filePath, context);
                return;
            }
            #endregion

            #region Configure Spare Parts
            //Download  Spare Parts Information Excel         
            if (context.Request.QueryString["SparePartsInfoExcel"] != null)
            {
                string materialQualityParameterExcelFile = context.Request.QueryString["SparePartsInfoExcel"];
                DownloadExcelFile(materialQualityParameterExcelFile, context);
                return;
            }

            //Download  Spare Parts Log File
            if (context.Request.QueryString["SparePartsLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["SparePartsLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion

            #region Task Group Info
            //Download Functional location Excel file
            if (context.Request.QueryString["SOPFileName"] != null)
            {
                string sopFileName = context.Request.QueryString["SOPFileName"] + ".zip";
                DownloadZipFile(sopFileName, context);
                return;
            }

            if (context.Request.QueryString["SOPLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["SOPLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion

            #region Work Group Info
            if (context.Request.QueryString["WorkGroupExcelFile"] != null)
            {
                string workGroupExcelInfo = context.Request.QueryString["WorkGroupExcelFile"];
                DownloadExcelFile(workGroupExcelInfo, context);
                return;
            }
            if (context.Request.QueryString["WorkGroupLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["WorkGroupLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion
            #endregion

            #region Dynamic Grid Download
            if (context.Request.QueryString["DynamicGridContentExcel"] != null)
            {
                string productionPlanExcelInfo = context.Request.QueryString["DynamicGridContentExcel"];
                DownloadExcelFile(productionPlanExcelInfo, context);
                return;
            }

            if (context.Request.QueryString["ProductionPlanLogFile"] != null)
            {
                string logExcelFile = context.Request.QueryString["ProductionPlanLogFile"];
                DownloadLogFile(logExcelFile, context);
                return;
            }
            #endregion

        }

        private void DownloadDocument(string fileName, string filePath, HttpContext context)
        {
            if (filePath != null && fileName != null)
            {
                byte[] path = null;
                using (var client = new System.Net.WebClient())
                {
                    path = client.DownloadData(filePath);
                }
                context.Response.ClearContent();
                context.Response.ClearHeaders();
                context.Response.ContentType = "application/image/pdf/octet-stream";
                context.Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
                context.Response.BinaryWrite(path);
                context.Response.End();
            }
        }

        private void DownloadExcelFile(string excelFile, HttpContext context)
        {
            string logFilePath = System.Configuration.ConfigurationManager.AppSettings["LogFileLocation"] + excelFile;
            if (logFilePath != null && logFilePath.Length > 4)
            {
                if (logFilePath.Contains(@"\"))
                {
                    if (File.Exists(logFilePath))
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(logFilePath);
                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + excelFile);
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                }
            }
        }

        private void DownloadZipFile(string fileName, HttpContext context)
        {
            string logFilePath = System.Configuration.ConfigurationManager.AppSettings["LogFileLocation"] + fileName;
            if (logFilePath != null && logFilePath.Length > 4)
            {
                if (logFilePath.Contains(@"\"))
                {
                    if (File.Exists(logFilePath))
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(logFilePath);
                        context.Response.Clear();
                        context.Response.ContentType = "application/zip";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                }
            }
        }

        private void DownloadLogFile(string CheckAndDownloadLogFile, HttpContext context)
        {
            //Log file reading
            string logFilePath = System.Configuration.ConfigurationManager.AppSettings["LogFileLocation"] + CheckAndDownloadLogFile;
            if (logFilePath != null && logFilePath.Length > 4)
            {
                if (logFilePath.Contains(@"\"))
                {
                    if (File.Exists(logFilePath))
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(logFilePath);
                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + CheckAndDownloadLogFile);
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                }
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}