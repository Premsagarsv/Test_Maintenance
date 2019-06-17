using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace Vegam_MaintenanceModule
{
    /// <summary>
    /// Summary description for DownloadHandler
    /// </summary>
    public class DownloadHandler : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            try
            {
                if (context.Request.QueryString["type"] != null && context.Request.QueryString["type"] == "FLocationTemplate")
                {
                    string functionalLocationTemplate = "FunctionalLocationInfo.rar";
                    DownloadTemplate(functionalLocationTemplate, context);
                    return;
                }
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message);
            }
            finally
            {
                context.Response.End();
            }
        }

        private void DownloadTemplate(string fileName, HttpContext context)
        {
            string path = context.Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["ExcelFormatFolder"]);

            string filePath = path + "\\" + fileName;
            if (filePath != null && filePath.Length > 4)
            {
                if (filePath.Contains(@"\"))
                {
                    if (File.Exists(filePath))
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(filePath);

                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName);
                        context.Response.AddHeader("Content-Length", fileInfo.Length.ToString());
                        context.Response.TransmitFile(fileInfo.FullName);
                        context.Response.Flush();
                    }
                }
            }
        }

        private void DownloadFile(string fileName, HttpContext context)
        {
            string filePath = System.Configuration.ConfigurationManager.AppSettings["LogFileLocation"] + fileName.Trim();
            if (filePath != null && filePath.Length > 4)
            {
                if (filePath.Contains(@"\"))
                {
                    if (File.Exists(filePath))
                    {
                        System.IO.FileInfo fileInfo = new System.IO.FileInfo(filePath);
                        context.Response.Clear();
                        context.Response.ContentType = "application/octet-stream";
                        context.Response.AddHeader("Content-Disposition", "attachment; filename=" + fileName.Trim());
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