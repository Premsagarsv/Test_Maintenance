using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Vegam_MaintenanceModule.ipas_UserService;

namespace Vegam_MaintenanceModule.BLL
{
    public class UserBLL
    {
        public static int[] GetPlantUserSites(int userID)
        {
            UserServiceClient service = new UserServiceClient();
            try
            {
                int[] output = service.GetPlantUserSites(userID);
                service.Close();
                return output;
            }
            catch
            { 
                service.Abort();
                throw;
            }
        }

        public static List<UserPermissions> GetUserPermissions(int userID,int siteID, List<int> pageIDList)
        {
            UserServiceClient userService = new UserServiceClient();
            try
            {
                List<UserPermissions> output = userService.GetUserPermissions(userID,siteID, pageIDList.ToArray()).ToList();
                userService.Close();
                return output;
            }
            catch
            {
                userService.Abort();
                throw;
            }
        }

        public static string GetUserAssignedPermissions(int userID,int siteID, int pageID)
        {
            UserServiceClient service = new UserServiceClient();
            try
            {
                string output = service.GetUserAssignedPermissions(userID,siteID, pageID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #region SiteFeature
        public static List<ipas_UserService.SiteFeatureInfo> GetCompanyFeatureConfiguredURL(int siteID,int pLineID, List<string> featureName)
        {
            UserServiceClient service = new UserServiceClient();
            try
            {
                List<ipas_UserService.SiteFeatureInfo> output = service.GetCompanyFeatureConfiguredURL(siteID,pLineID, featureName.ToArray()).ToList();
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static ipas_CompanyService.CompanySiteList GetAllSites(int userID)
        {
            ipas_CompanyService.CompanyServiceClient service = new ipas_CompanyService.CompanyServiceClient();
            try
            {
                ipas_CompanyService.CompanySiteList companySiteList = service.GetAllSites(userID);
                service.Close();
                return companySiteList;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        #endregion

        public static UserPermissions[] GetAllUserAssignedPermissionsWithType(int userID,int siteID, TypeMasterData masterData)
        {
            UserServiceClient service = new UserServiceClient();
            try
            {
                UserPermissions[] output = service.GetAllUserAssignedPermissionsWithType(userID,siteID, masterData);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static AccessInfo GetUserAssignedPermissionsWithAccessLevel(BasicInfo basicInfo, int pageID)
        {
            ipas_UserService.UserServiceClient service = new ipas_UserService.UserServiceClient();
            try
            {
                AccessInfo output = service.GetUserAssignedPermissionsWithAccessLevel(basicInfo, pageID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }

        public static string GenerateSaltKey(string emailID)
        {
            UserServiceClient service = new UserServiceClient();
            try
            {
                string output = service.GenerateSaltKey(emailID);
                service.Close();
                return output;
            }
            catch
            {
                service.Abort();
                throw;
            }
        }
    }
}