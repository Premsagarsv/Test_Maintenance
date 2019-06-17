using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Vegam_MaintenanceModule.ipas_SiteService;

namespace Vegam_MaintenanceModule.BLL
{
    public class SiteBLL
    {
        public static PlantSettings GetPlantSettings(int siteID)
        {
            SiteServiceClient siteService = new SiteServiceClient();
            try
            {
                PlantSettings output = siteService.GetPlantSettings(siteID);
                siteService.Close();
                return output;
            }
            catch
            {
                siteService.Abort();
                throw;
            }
        }
    }
}