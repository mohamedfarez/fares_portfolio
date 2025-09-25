// CV Actions Library
export class CVActions {
  private static readonly CV_PATH = '/fares-cv.pdf';
  private static readonly CV_FILENAME = 'Mohamed_Fares_CV.pdf';

  /**
   * Download CV PDF file
   */
  static async downloadCV(): Promise<boolean> {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = this.CV_PATH;
      link.download = this.CV_FILENAME;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error downloading CV:', error);
      return false;
    }
  }

  /**
   * Preview CV in new window/tab
   */
  static async previewCV(): Promise<boolean> {
    try {
      // Open PDF in new window
      const newWindow = window.open(this.CV_PATH, '_blank');
      
      if (newWindow) {
        newWindow.focus();
        return true;
      } else {
        // Fallback: try to download if popup blocked
        console.warn('Popup blocked, falling back to download');
        return this.downloadCV();
      }
    } catch (error) {
      console.error('Error previewing CV:', error);
      return false;
    }
  }



  /**
   * Check if CV file exists
   */
  static async checkCVExists(): Promise<boolean> {
    try {
      const response = await fetch(this.CV_PATH, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking CV file:', error);
      return false;
    }
  }

  /**
   * Get CV file info
   */
  static getCVInfo() {
    return {
      filename: this.CV_FILENAME,
      path: this.CV_PATH,
      lastUpdated: 'Jan 2025',
      size: 'PDF Document'
    };
  }
}
