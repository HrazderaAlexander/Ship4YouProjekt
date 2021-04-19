'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">angularfirebase-authentication documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' : 'data-target="#xs-components-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' :
                                            'id="xs-components-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                            <li class="link">
                                                <a href="components/AboutUsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AboutUsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BewertungComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BewertungComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BoatDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BoatDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactUsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactUsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateBoatComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateBoatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateFeedbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateFeedbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditBoatComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditBoatComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditFeedbackComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditFeedbackComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForgotPasswordComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ForgotPasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImageSliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImageSliderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultiplePicturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MultiplePicturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShowUpload.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShowUpload</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignInComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignInComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignUpComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignUpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadTaskComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadTaskComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadTaskDocumentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadTaskDocumentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UploadTaskMultiplePicturesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UploadTaskMultiplePicturesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerifyEmailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VerifyEmailComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' : 'data-target="#xs-directives-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' :
                                        'id="xs-directives-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                        <li class="link">
                                            <a href="directives/DropzoneDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropzoneDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/MaterialElevationDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">MaterialElevationDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' : 'data-target="#xs-injectables-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' :
                                        'id="xs-injectables-links-module-AppModule-a9c8351108accaf156de4c41bbd5b30a"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FirebaseService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FirebaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ContactUsComponent.html" data-type="entity-link">ContactUsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link">DashboardComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BoatDTO.html" data-type="entity-link">BoatDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmDialogModel.html" data-type="entity-link">ConfirmDialogModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfirmDialogModel-1.html" data-type="entity-link">ConfirmDialogModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/FavModel.html" data-type="entity-link">FavModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Picture.html" data-type="entity-link">Picture</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rating.html" data-type="entity-link">Rating</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BoatService.html" data-type="entity-link">BoatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConnectionService.html" data-type="entity-link">ConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link">FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseService.html" data-type="entity-link">FirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link">ImageService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/SecureInnerPagesGuard.html" data-type="entity-link">SecureInnerPagesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Boat.html" data-type="entity-link">Boat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BoatData.html" data-type="entity-link">BoatData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link">Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pictureArrayInterface.html" data-type="entity-link">pictureArrayInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Test.html" data-type="entity-link">Test</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Test-1.html" data-type="entity-link">Test</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Types.html" data-type="entity-link">Types</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});