const commonUtil = require('./commonUtil');

const handlersUtil = {
  onPathContentFetchedForBtns: data => {
    const formattedFileSize = commonUtil.getFileSizeAndUnit(data);

    commonUtil.removePrevInstancesOf('.js-file-clipboard');
    commonUtil.removePrevInstancesOf('.js-file-download');

    const btnGroupHtml = `
      <button aria-label="Copy file contents to clipboard" class="js-file-clipboard btn btn-sm BtnGroup-item file-clipboard-button tooltipped-s js-enhanced-github-copy-btn" data-copied-hint="Copied!" type="button" click="selectText()" data-clipboard-target="tbody">
        Copy File
      </button>
      <a href="${data.download_url}" download="${data.name}"
        aria-label="(Option + Click) to download. (Cmd/Ctr + Click) to view raw contents." class="js-file-download btn btn-sm BtnGroup-item file-download-button tooltipped-s">
        <span style="margin-right: 5px;">${formattedFileSize}</span>
      </a>`;

    const btnGroup = document.querySelectorAll('.BtnGroup:not(.d-md-none)')[1];

    btnGroup.insertAdjacentHTML('beforeend', btnGroupHtml);
  },
  onPathContentFetched: (data = []) => {
    data = commonUtil.sortFileStructureAsOnSite(data);

    if (!data) {
      return;
    }

    let isAnyFilePresent = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 'file') {
        isAnyFilePresent = true;
        break;
      }
    }

    if (!isAnyFilePresent) {
      return;
    }

    setTimeout(function() {
      commonUtil.removePrevInstancesOf('.eg-download'); // remove before adding new ones

      let actualDataIndex = 0;
      let startIndex = 0;

      if (
        window.location.pathname &&
        window.location.pathname.indexOf(`tree/${commonUtil.getBranch()}`) > -1 &&
        !window.location.pathname.endsWith(`tree/${commonUtil.getBranch()}`) &&
        !window.location.pathname.endsWith(`tree/${commonUtil.getBranch()}/`)
      ) {
        startIndex = 1;
      }

      const repoPath = commonUtil.getUsernameWithReponameFromGithubURL();

      if (
        window.location.pathname !== `/${repoPath.user}/${repoPath.repo}` &&
        window.location.href.indexOf('tree/' + commonUtil.getBranch()) === -1
      ) {
        return;
      }

      const containerItems = document.querySelectorAll('table > tbody > tr.react-directory-row')

      for (var i = startIndex; i < containerItems.length; i++) {
        const commitElem = containerItems[i].querySelector('td > div.react-directory-commit-age');
        const isValidFile = (data[actualDataIndex].type === 'file' && data[actualDataIndex].size !== 0) || (data[actualDataIndex].type === 'symlink');

        document.querySelectorAll('tbody tr > td:nth-child(1)')[0].setAttribute('colspan', '6');
        commitElem.parentElement.previousElementSibling.setAttribute('colspan', '3');

        if (commitElem && isValidFile) {
          const formattedFileSize = commonUtil.getFileSizeAndUnit(data[actualDataIndex]);

          commitElem.parentElement.insertAdjacentHTML('beforebegin', `
            <td class="eg-download" style="text-align: right;">
              <a class="tooltipped-s" href="${data[actualDataIndex].download_url}" title="⎇🖰 DL. ⎈¦◆🖰 raw" aria-label="(Option + Click) to download. (Cmd/Ctr + Click) to view raw contents."
                download="${data[actualDataIndex].name}">
                <span class="react-directory-download Link--secondary">${formattedFileSize}</span>
              </a>
            </td>
          `)
        } else {
          commitElem.parentElement.insertAdjacentHTML('beforebegin', `<td class="eg-download" style="text-align: right;"><div class="react-directory-download"></div></td>`)
        }
        actualDataIndex++;
        /* if (commitElem) {
          containerItems[i].querySelector('div:nth-of-type(2)').classList.remove('col-md-2', 'mr-3');
          containerItems[i].querySelector('div:nth-of-type(2)').classList.add('col-md-1', 'mr-2');

          if (isValidFile || data[actualDataIndex].type === 'symlink') {
            const formattedFileSize = commonUtil.getFileSizeAndUnit(data[actualDataIndex]);

            const html = `
              <div role="gridcell" class="mr-1 text-gray-light eg-download" style="width: 95px;">
                <span class="css-truncate css-truncate-target d-block" style="text-align: right;">
                  <span style="margin-right: 15px;">
                    ${formattedFileSize}
                  </span>
                  <a style="float: right" href="${data[actualDataIndex].download_url}" title="(Option + Click) to download. (Cmd/Ctr + Click) to view raw contents." aria-label="(Option + Click) to download. (Cmd/Ctr + Click) to view raw contents." class="tooltipped-s"
                    download="${data[actualDataIndex].name}">
                  </a>
                </span>
              </div>
            `;

            commitElem.insertAdjacentHTML('afterend', html);
          } else {
            const defaultHtml = `
              <div role="gridcell" class="mr-1 eg-download" style="width: 90px;"></div>
            `;

            commitElem.insertAdjacentHTML('afterend', defaultHtml);
          }

          actualDataIndex++;
        } */
      }
    }, 1000);
  }
};

module.exports = handlersUtil;
