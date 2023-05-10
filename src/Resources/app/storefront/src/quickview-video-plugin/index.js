import HttpClient from 'src/service/http-client.service';
import Plugin from 'src/plugin-system/plugin.class';

export default class QuickViewVideoPlugin extends Plugin {

    init() {
        this.approval = document.getElementById('quickviewvideo');
        this._registerEvents();
    }

    _registerEvents()
    {
        this.approval.addEventListener('click', (event) => {
            $('#myModal').on('shown.bs.modal', function () {
                $('#myInput').trigger('focus')
            })
        });
    }

    _setContent(response) {
        let dataResponse = JSON.parse(response);
        myModal.hide()


    }
}

