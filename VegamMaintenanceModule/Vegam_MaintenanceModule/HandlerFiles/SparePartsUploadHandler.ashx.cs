﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Vegam_MaintenanceModule.Vegam_MaintenanceService;

namespace Vegam_MaintenanceModule.HandlerFiles
{
    /// <summary>
    /// Summary description for SparePartsUploadHandler
    /// </summary>
    public class SparePartsUploadHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            try
            {
                string siteID = context.Request.QueryString["sid"];
                string userID = context.Request.QueryString["uid"];

                int site = 0;
                int user = 0;
                int.TryParse(siteID, out site);
                int.TryParse(userID, out user);

                BasicParam basicParam = new BasicParam();
                basicParam.SiteID = site;
                basicParam.UserID = user;

                if (site == 0 || user == 0)
                {
                    throw new Exception("Invalid user/site identification number");
                }
                else
                {
                    var file = context.Request.Files[0];
                    string[] tempFileName = file.FileName.Split('\\');
                    string fileName = tempFileName[tempFileName.Length - 1];
                    string[] tempSaveName = fileName.Split('.');
                    string tempSave = tempSaveName[0] + "_" + DateTime.Now.ToString("ddMMhhmmssffff");
                    string pathSave = System.Configuration.ConfigurationManager.AppSettings["LogFileLocation"] + tempSave + ".xls";
                    file.SaveAs(pathSave);

                    string logFile = string.Empty;
                    logFile = BLL.MaintenanceBLL.UploadSparePartsinfoExcel(basicParam, tempSave);
                    context.Response.Write("success," + logFile);
                }
            }
            catch (Exception ex)
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write("false," + ex.Message);
            }
            finally
            {
                context.Response.End();
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