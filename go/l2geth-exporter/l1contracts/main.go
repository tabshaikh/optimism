package l1contracts

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/optimisticben/optimism/go/l2geth-exporter/bindings"
)

// OVMCTC interacts with the OVM CTC contract
type OVMCTC struct {
	ctx     context.Context
	address common.Address
	client  *ethclient.Client
}

func (ovmctc *OVMCTC) getTotalElements() (*big.Int, error) {

	contract, err := bindings.NewOVMCanonicalTransactionChainCaller(ovmctc.address, ovmctc.client)
	if err != nil {
		return nil, err
	}

	totalElements, err := contract.GetTotalElements(&bind.CallOpts{
		Context: ovmctc.ctx,
	})
	if err != nil {
		return nil, err
	}

	return totalElements, nil

}
